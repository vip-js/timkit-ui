Component({
  data: { receipt: '' },
  onApprove() {
    this.setData({ receipt: 'Receipt: Approved' })
  },
  onReject() {
    this.setData({ receipt: 'Receipt: Rejected' })
  },
})
